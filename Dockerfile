FROM node:14.18.1

WORKDIR /opt 
RUN apt install -y git 
RUN mkdir coworkingBackEnd/
WORKDIR /opt/coworkingBackEnd
COPY . .
RUN npm install
#RUN npm run dev
expose 5000
CMD [ "npm", "run", "dev" ]
